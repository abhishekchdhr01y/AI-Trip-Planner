import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
     
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${apiKey}`;

      const res = await fetch(searchUrl);
      const data = await res.json();
      const place = data.results?.[0];
      const photoRef = place?.photos?.[0]?.photo_reference;

      if (photoRef) {
        
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&maxheight=800&photo_reference=${photoRef}&key=${apiKey}`;
        return NextResponse.json({ photoUrl });
      }
    } catch (err) {
      console.error("Standard Places API error:", err);
    }
  }

  
  try {
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=1&prop=pageimages&piprop=original&format=json&origin=*`;
    
    const wikiRes = await fetch(wikiUrl);
    const wikiData = await wikiRes.json();
    const pages = wikiData?.query?.pages;
    
    if (pages) {
      const pageId = Object.keys(pages)[0];
      const realImg = pages[pageId]?.original?.source;
      if (realImg) {
        return NextResponse.json({ photoUrl: realImg });
      }
    }
  } catch (err) {
    console.error("Wikimedia fallback error:", err);
  }

  
  return NextResponse.json({ 
    photoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
  });
}