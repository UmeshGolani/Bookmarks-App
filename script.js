const form = document.getElementById("bookmark-form");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const list = document.getElementById("bookmarks-list");
const submitBtn = form.querySelector("input[type='submit']");

const API_URL = "https://crudcrud.com/api/662a8ee1608949f3b763e96c7e74ed83/bookmarks";

let editId = null;

window.addEventListener("DOMContentLoaded", fetchBookmarks);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if (!title || !url) {
    alert("Please fill all fields");
    return;
  }

  const bookmark = {
    title,
    url: url.startsWith("http") ? url : `https://${url}` //Adding a check to ensure the URL starts with http or https
  };

  try {
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark)
      });
      editId = null;
      submitBtn.value = "Save Bookmark";
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark)
      });
    }

    form.reset();
    fetchBookmarks();
  } catch (err) {
    console.error(err);
  }
});

async function fetchBookmarks() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    list.innerHTML = "";

    data.forEach(b => {
      const div = document.createElement("div");
      div.className = "bookmark";

      div.innerHTML = `
        <strong>${b.title}</strong>
        <a href="${b.url}" target="_blank">${b.url}</a>
        <div class="actions">
          <button class="edit-btn" onclick="editBookmark('${b._id}', '${b.title}', '${b.url}')">Edit</button>
          <button class="delete-btn" onclick="deleteBookmark('${b._id}')">Delete</button>
        </div>
      `;

      list.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

function editBookmark(id, title, url) {
  titleInput.value = title;
  urlInput.value = url;
  editId = id;
  submitBtn.value = "Update Bookmark";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteBookmark(id) {
  if (!confirm("Delete this bookmark?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBookmarks();
  } catch (err) {
    console.error(err);
  }
}
