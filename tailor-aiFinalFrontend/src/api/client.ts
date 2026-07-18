const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";


export async function apiGet<T>(path:string):Promise<T>{

 const response = await fetch(`${API_BASE_URL}${path}`);

 if(!response.ok){
   const error = await response.json();

   throw new Error(
     error.error?.message ?? 
     `API error: ${response.status}`
   );
 }

 return response.json();
}


export async function apiPost<T>(
  path: string,
  body: object
): Promise<T> {

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers:{
      "Content-Type":"application/json",
    },
    body: JSON.stringify(body),
  });

  if(!response.ok){
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}