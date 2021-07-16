import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamoDBCliente";

export const handle: APIGatewayProxyHandler = async (event) => {
    const { userid } = event.pathParameters
    console.log("🚀 ~ file: listTodo.ts ~ line 6 ~ consthandle:APIGatewayProxyHandler= ~ userid", userid)
    const queryResponse =  await document.scan({
        TableName: "todos",
        FilterExpression: "user_id = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        }

    }).promise()

    const todos = queryResponse.Items

    return {
        statusCode: 200,
        body: JSON.stringify(todos),
        headers: {
            "Content-Type": "application/json"
        }
    }
}