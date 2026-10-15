import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "ShortUrlMappings";

function generateShortCode(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return result;
}

export const handler = async (event) => {
  try {
    const body =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body;

    const url = body?.url?.trim();

    if (!url) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "URL is required",
        }),
      };
    }

    const shortCode = generateShortCode();

    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          shortCode,
          url,
          createdAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(shortCode)",
      })
    );

    const baseUrl =
      process.env.SHORT_URL_BASE ||
      "https://YOUR-API-GATEWAY-URL";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        shortUrl: `${baseUrl}/${shortCode}`,
      }),
    };
  } catch (error) {
    console.error("Error creating short URL:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Could not create short URL",
      }),
    };
  }
};
