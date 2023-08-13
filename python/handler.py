import json
import boto3
from boto3.dynamodb.types import TypeSerializer, TypeDeserializer

td = TypeDeserializer()

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        user_id = event['pathParameters']['id']
        
        response = dynamodb.get_item(
            TableName='User',
            Key={
                'id': {'S': user_id}
            }
        )
        
        if 'Item' in response:
            user = response['Item']
            return {
                'statusCode': 200,
                'body': json.dumps(unmarshall(user))
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('{error: "not found user"}')
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }


def unmarshall(dynamo_obj: dict) -> dict:
    """Convert a DynamoDB dict into a standard dict."""
    return {k: td.deserialize(v) for k, v in dynamo_obj.items()}
