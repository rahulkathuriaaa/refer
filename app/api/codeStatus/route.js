import { NextRequest, NextResponse } from "next/server";
import Shopify from "shopify-api-node";

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const shopName = cleanShopifyUrl(reqBody.shopName);
    const accessToken = reqBody.accessToken;
    const targetDiscountCode = reqBody.code; // Get the specific code to search

    if (!shopName || !accessToken || !targetDiscountCode) {
      return NextResponse.json(
        { error: "Missing shop name, access token, or discount code" },
        { status: 400 }
      );
    }

    const shop = new Shopify({
      shopName,
      accessToken,
      autoLimit: true,
    });

    shop.on("callLimits", (limits) => console.log(limits));

    const priceRules = await shop.priceRule.list();
    const discountUsage = [];

    for (const priceRule of priceRules) {
      try {
        console.log(
          "Fetching discount codes for price rule:",
          priceRule.id,
          typeof priceRule.id
        );

        const discountCodes = await shop.discountCode.list(priceRule.id);

        for (const discountCode of discountCodes) {
          discountUsage.push({
            priceRuleTitle: priceRule.title,
            discountCode: discountCode.code,
            usageCount: discountCode.usage_count,
          });
        }
      } catch (error) {
        console.error(
          `Error fetching discount codes for price rule ${priceRule.id}:`,
          error.response ? error.response : error
        );
      }
    }
    const foundDiscount = discountUsage.find(
      (discount) =>
        discount.discountCode.toLowerCase() === targetDiscountCode.toLowerCase()
    );
    if (foundDiscount) {
      console.log("code and usage ",foundDiscount.discountCode,foundDiscount.usageCount)
      return NextResponse.json(
        {
          message: "Discount code found",
          discountCode: foundDiscount.discountCode,
          usageCount: foundDiscount.usageCount,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Discount code not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching discount code usage:", error);
    const errorMessage = error.response
      ? error.response.body
        ? error.response.body
        : error.response
      : error.message;

    return NextResponse.json(
      {
        error: "An error occurred while fetching discount code usage.",
        details: errorMessage,
        statusCode: error.response ? error.response.statusCode : 500,
      },
      { status: error.response ? error.response.statusCode : 500 }
    );
  }
}

// Helper function to clean the Shopify URL
function cleanShopifyUrl(url) {
  // Remove the protocol (http:// or https://)
  url = url.replace(/^https?:\/\//, "");

  // Remove any path or query parameters after the domain
  url = url.replace(/\/.*$/, "");

  // Extract the subdomain and domain
  const parts = url.split(".");

  if (parts.length >= 3 && parts[parts.length - 2] === "myshopify") {
    // Return the last 3 parts (subdomain.myshopify.com)
    return parts.slice(-3).join(".");
  } else {
    // Return an empty string if the URL is not in the expected format
    return "";
  }
}
