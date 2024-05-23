import { NextRequest, NextResponse } from "next/server";
import shopify from "shopify-api-node";
export async function POST(req, res) {
  // const { apiKey } = req.body;
  let params = { limit: 10 };


  function cleanShopifyUrl(url) {
    // Remove the protocol (http:// or https://)
    url = url.replace(/^https?:\/\//, '');
  
    // Remove any path or query parameters after the domain
    url = url.replace(/\/.*$/, '');
  
    // Extract the subdomain and domain
    const parts = url.split('.');
  
    if (parts.length >= 3 && parts[parts.length - 2] === 'myshopify') {
      // Return the last 3 parts (subdomain.myshopify.com)
      return parts.slice(-3).join('.');
    } else {
      // Return an empty string if the URL is not in the expected format
      return '';
    }
  }
  const reqBody = await req.json();
  console.log("request body", reqBody);
  console.log("token", reqBody.accessToken); //shopName
  try {
    // Create a new Shopify API instance with the provided API key
    const shop = new shopify({
      shopName: cleanShopifyUrl(reqBody.shopName),
      accessToken: reqBody.accessToken,
    });


    // Define the discount code properties




    const response = await shop.product.list(params)
    console.log(response);
    return NextResponse.json({ products: response }, { status: 200 });
    return;
    // res.status(200).json({ discountCode: response.discount_code });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
    
  }
}
