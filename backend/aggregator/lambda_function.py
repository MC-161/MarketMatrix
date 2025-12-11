import boto3
import json
import logging
from datetime import datetime, timedelta
from decimal import Decimal

# --- CONFIG ---
BUCKET_NAME = "signalgrid-ui-2025"
FILE_NAME = "market-data-historical.json"

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
stock_table = dynamodb.Table('StockData')
history_table = dynamodb.Table('StockHistory')

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

def save_daily_snapshot(stocks):
    """
    Takes the FULL list of current stocks and saves it as this hour's snapshot.
    This runs once per execution, so it saves ALL stocks, not just a batch.
    """
    try:
        # Create a simplified version of stocks for history (remove heavy arrays)
        snapshot_items = []
        for s in stocks:
            item = {
                "ticker": s["ticker"],
                "status": s.get("status"),
                "sector": s.get("sector"),
                "sma_200": Decimal(str(s.get("sma_200", 0))),
                "sma_50": Decimal(str(s.get("sma_50", 0))),
                "signal": s.get("signal"),
            }
            if "market_cap" in s:
                item["market_cap"] = Decimal(str(s["market_cap"]))
            snapshot_items.append(item)

        snapshot_id = datetime.now().strftime("%Y-%m-%d-%H")
        
        # Save to DynamoDB
        history_table.put_item(Item={
            "snapshot_id": snapshot_id,
            "timestamp": datetime.now().isoformat(),
            "stocks": snapshot_items,
            "ttl": int((datetime.now() + timedelta(days=30)).timestamp())
        })
        logger.info(f"Saved snapshot {snapshot_id} with {len(snapshot_items)} stocks")
    except Exception as e:
        logger.error(f"Failed to save snapshot: {e}")

def lambda_handler(event, context):
    try:
        # 1. Fetch Current FULL Data
        logger.info("Fetching current stock data...")
        response = stock_table.scan()
        current_stocks_raw = response.get('Items', [])
        
        # Handle pagination to get ALL 100+ stocks
        while 'LastEvaluatedKey' in response:
            response = stock_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            current_stocks_raw.extend(response.get('Items', []))
        
        current_stocks = convert_decimals(current_stocks_raw)
        logger.info(f"Loaded {len(current_stocks)} stocks from StockData.")

        # 2. CREATE SNAPSHOT (The Fix)
        # We save the full list we just fetched into the history table
        save_daily_snapshot(current_stocks)

        # 3. Fetch Historical Snapshots (Replay)
        logger.info("Fetching historical snapshots for timeline...")
        historical_snapshots = []
        now = datetime.now()

        for i in range(24): 
            time_target = now - timedelta(hours=i)
            snap_id = time_target.strftime("%Y-%m-%d-%H")
            
            try:
                resp = history_table.get_item(Key={'snapshot_id': snap_id})
                if 'Item' in resp:
                    item = resp['Item']
                    historical_snapshots.append({
                        "timestamp": item.get('timestamp'),
                        "stocks": convert_decimals(item.get('stocks', []))
                    })
            except Exception as e:
                logger.error(f"Error fetching {snap_id}: {e}")

        # 4. Upload to S3
        final_payload = {
            "stockData": current_stocks,
            "historicalSnapshots": historical_snapshots,
            "retrieved_at": now.isoformat()
        }

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=FILE_NAME,
            Body=json.dumps(final_payload),
            ContentType='application/json'
        )

        return {"statusCode": 200, "body": "Dashboard updated & Snapshot saved"}

    except Exception as e:
        logger.error(f"Aggregator failed: {e}")
        return {"statusCode": 500, "body": str(e)}