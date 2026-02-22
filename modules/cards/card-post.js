export function renderPostCard(item) {
  return `
    <div class="card card-post">
      <div class="card-body">
        <p>${item.text}</p>
      </div>
    </div>
  `;
}
