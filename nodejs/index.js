const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

module.exports.handler = async (event) => {
  const id = event.pathParameters.id ?? "";

  const result = await client.send(
    new GetItemCommand({ TableName: "User", Key: { id: { S: id } } })
  );

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify(
        {
          error: "not found user",
        },
        null,
        2
      ),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(result.Item ?? {})),
  };
};
