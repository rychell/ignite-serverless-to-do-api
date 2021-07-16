import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamoDBCliente";
import {v4 as uuidv4} from 'uuid'

interface IRequest {
    title: string
    deadline: string
}
interface ITodo{
    id: string
    user_id: string
    title: string
    done: boolean
    deadline: Date
}
export const handle: APIGatewayProxyHandler = async (event) => {
    const { userid } = event.pathParameters
    const { title, deadline } = JSON.parse(event.body) as IRequest

    const errors = []
    if(!title){
        errors.push("A todo should have title")
    }
    if(!deadline){
        errors.push("A todo should have a deadline")
    }
    if(!isValidDate(deadline)){
        errors.push("A todo must have a valid date. Format as YYYY-MM-DD HH:mm:ss")
    }

    const todo = {
        id: uuidv4(),
        user_id: userid,
        title,
        done: false,
        deadline: new Date(deadline).toISOString()
    }

    if (errors.length){
        return {
            statusCode: 400,
            body: JSON.stringify({
                errors
            }),
            headers:{
                "Content-Type": "application/json"
            }
        }
    }
    await document.put({
        TableName: "todos",
        Item: todo
    }).promise()

    return {
        statusCode: 200,
        body: JSON.stringify(todo),
        headers:{
            "Content-Type": "application/json"
        }
    }
}

function isValidDate(date: string){
    return new Date(date) != "Invalid Date"
}