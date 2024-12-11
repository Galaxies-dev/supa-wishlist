// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// HTML template function for better organization
function generateHtmlTemplate(userName: string, items: any[]) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${userName}'s Wishlist</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .wishlist-header {
                text-align: center;
                padding: 20px 0;
                background-color: white;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .items-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
            .item-card {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .item-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 4px;
            }
            .item-price {
                color: #2f9e44;
                font-weight: bold;
            }
            .item-link {
                color: #228be6;
                text-decoration: none;
            }
            .item-link:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="wishlist-header">
            <h1>${userName}'s Wishlist</h1>
        </div>
        <div class="items-grid">
            ${
    items.map((item) => `
                <div class="item-card">
                    ${
      item.image_url
        ? `<img class="item-image" src="${item.image_url}" alt="${item.name}">`
        : ""
    }
                    <h3>${item.name}</h3>
                    ${
      item.price ? `<p class="item-price">$${item.price}</p>` : ""
    }
                    ${item.description ? `<p>${item.description}</p>` : ""}
                    ${
      item.url
        ? `<a class="item-link" href="${item.url}" target="_blank">View Item →</a>`
        : ""
    }
                </div>
            `).join("")
  }
        </div>
    </body>
    </html>
  `;
}

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  try {
    // Get wishlist ID from URL parameters
    const url = new URL(req.url);
    const wishlistId = url.searchParams.get("id");

    if (!wishlistId) {
      return new Response("Wishlist ID is required", { status: 400 });
    }
    console.log("fetch wishlistId", wishlistId);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // Fetch wishlist and user data
    const { data: wishlist, error: wishlistError } = await supabaseClient
      .from("wishlists")
      .select(`
        *,
        profiles:user_id (
          username
        )
      `)
      .eq("id", wishlistId)
      .single();
    console.log("data: ", wishlist);

    if (wishlistError || !wishlist) {
      return new Response("Wishlist not found", { status: 404 });
    }

    // Fetch wishlist items
    const { data: items, error: itemsError } = await supabaseClient
      .from("items")
      .select("*")
      .eq("wishlist_id", wishlistId)
      .order("created_at", { ascending: false });

    if (itemsError) {
      return new Response("Error fetching wishlist items", { status: 500 });
    }

    // Generate HTML with the wishlist data
    const html = generateHtmlTemplate(
      wishlist.profiles.username || "Anonymous",
      items || [],
    );

    // Return HTML response
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    return new Response(`Server error: ${error.message}`, { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/list' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
