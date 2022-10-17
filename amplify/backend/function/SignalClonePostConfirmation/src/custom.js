/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger
  if (!event?.request?.userAttributes?.sub) {
    console.log("no sub provided");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();

  const userItem = {
    __typename: { S: "User" },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    createdAt: { S: now.toISOString() },
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
  };

  const params = {
    Item: userItem,
    TableName: tableName,
  };

  try {
    await docClient.putItem(params).promise();
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};
