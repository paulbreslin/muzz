import { mockData } from "./mockData";

export async function GET() {
  return Response.json(mockData);
}
