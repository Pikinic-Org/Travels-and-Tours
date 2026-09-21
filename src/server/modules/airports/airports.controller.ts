import { getAirportByCode, searchAirports } from "@/server/modules/airports/airports.service";

// GET /api/airports?q=lon      → airports matching a city, name, code or country
// GET /api/airports?code=LOS   → the single airport with that IATA code
export const search = async (request: Request) => {
  const params = new URL(request.url).searchParams;

  const code = params.get("code");
  if (code) {
    const airport = getAirportByCode(code);
    return airport ? Response.json(airport) : Response.json({ error: "Airport not found." }, { status: 404 });
  }

  const query = params.get("q") ?? "";
  return Response.json(searchAirports(query.slice(0, 60)));
};
