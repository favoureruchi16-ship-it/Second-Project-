const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const gridEl = document.getElementById("postGrid");
const searchEl = document.getElementById("postSearch");

let allPosts = []; // keep the full list in memory so we can filter without refetching

async function fetchPosts() {
  try {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    gridEl.innerHTML = "";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    allPosts = await response.json();
    renderPosts(allPosts);

  } catch (err) {
    console.error("Fetch error:", err);
    errorEl.textContent = "Something went wrong while loading posts. Please try again later.";
    errorEl.style.display = "block";
  } finally {
    loadingEl.style.display = "none";
  }
}

function renderPosts(posts) {
  gridEl.innerHTML = "";
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.innerHTML = `
      <h3>#${post.id} - ${post.title}</h3>
      <p>${post.body}</p>
    `;
    gridEl.appendChild(card);
  });
}

searchEl.addEventListener("input", () => {
  const q = searchEl.value.toLowerCase();
  renderPosts(allPosts.filter(p => p.title.toLowerCase().includes(q)));
});

fetchPosts();