// 🔹 Replace with YOUR values from Supabase Project Settings → API
const SUPABASE_URL = "https://jywzohoowfgtyknlkekd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5d3pvaG9vd2ZndHlrbmxrZWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzA1MTYsImV4cCI6MjA3MjQwNjUxNn0.luyyq0jQFj2bD3m3LxtTpd6PFwl0mQq5pYMAotjAsD8";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Upload handler
document.getElementById("register_button").addEventListener("click", async (e) => {
  e.preventDefault();
  let x = document.getElementsByClassName("input2")

  const name = x[0].value;
  const email = x[1].value;
  const password = x[2].value


  // Save into table "test"
  const { error: insertError } = await supabaseClient
    .from("test")
    .insert([{ name: name, eamil: email, password: password }]);

  if (insertError) {
    alert("❌ Failed to save record!");
    console.error(insertError);
  } else {
    alert("✅ Success! Saved to Supabase.");
  }
});

// Fetch names
document.getElementById("fetchNames").addEventListener("click", async () => {
  const { data, error } = await supabaseClient
    .from("test")
    .select("name");

  if (error) {
    alert("❌ Failed to fetch names!");
    console.error(error);
    return;
  }

  const nameList = document.getElementById("nameList");
  nameList.innerHTML = "";

  data.forEach((row) => {
    const li = document.createElement("li");
    li.textContent = row.name.toUpperCase(); // CAPITALIZED
    nameList.appendChild(li);
  });
});
