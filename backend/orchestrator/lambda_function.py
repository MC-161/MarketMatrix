import boto3
import json

# --- CONFIGURATION ---
QUEUE_URL = "https://sqs.eu-north-1.amazonaws.com/851725286956/StockJobQueue" 

# List of S&P 100 Stocks (Full List)
STOCKS = [
    "AAPL", "ABBV", "ABT", "ACN", "ADBE", "AIG", "AMD", "AMGN", "AMT", "AMZN",
    "AVGO", "AXP", "BA", "BAC", "BK", "BKNG", "BLK", "BMY", "BRK.B", "C",
    "CAT", "CHTR", "CL", "CMCSA", "COF", "COP", "COST", "CRM", "CSCO", "CVS",
    "CVX", "DE", "DHR", "DIS", "DOW", "DUK", "EMR", "EXC", "F", "FDX",
    "GD", "GE", "GILD", "GM", "GOOG", "GOOGL", "GS", "HD", "HON", "IBM",
    "INTC", "JNJ", "JPM", "KHC", "KO", "LIN", "LLY", "LMT", "LOW", "MA",
    "MCD", "MDLZ", "MDT", "MET", "META", "MMM", "MO", "MRK", "MS", "MSFT",
    "NEE", "NFLX", "NKE", "NVDA", "ORCL", "PEP", "PFE", "PG", "PM", "PYPL",
    "QCOM", "RTX", "SBUX", "SCHW", "SO", "SPG", "T", "TGT", "TMO", "TMUS",
    "TSLA", "TXN", "UNH", "UNP", "UPS", "USB", "V", "VZ", "WFC", "WMT",
    "XOM"
]

sqs = boto3.client('sqs')

def lambda_handler(event, context):
    print(f"🚀 Starting Orchestrator for {len(STOCKS)} stocks...")
    
    for ticker in STOCKS:
        # Create message payload
        message = {
            'ticker': ticker
        }
        
        # Send to SQS
        response = sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps(message)
        )
        print(f"Sent {ticker} to Queue: {response['MessageId']}")
    
    return {
        'statusCode': 200,
        'body': f"Successfully triggered {len(STOCKS)} jobs."
    }