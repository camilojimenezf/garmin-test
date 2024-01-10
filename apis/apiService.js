// services/apiService.js
export async function saveRoute(routeData) {
  try {
    const response = await fetch("/api/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeData),
    });

    if (!response.ok) throw new Error("Network response was not ok.");

    return response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
