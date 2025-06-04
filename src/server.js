import fs from "node:fs/promises";
import http from "node:http";
import open from "open";

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || "";
  });
};

const formatStories = (stories) => {
  return stories
    .map((story) => {
      return `
        <article class="story">
            <h2 class="story__title">${story.content}</h2>
            <div class="story__tags">
            ${story.tags.map((tag) => `<p class="tag">${tag}</p>`).join("")}
            </div>
        </article>
        `;
    })
    .join("\n");
};

const createServer = (stories) => {
  return http.createServer(async (req, res) => {
    const HTML_Path = new URL("./template.html", import.meta.url);
    const template = await fs.readFile(HTML_Path, "utf-8");
    const html = interpolate(template, { stories: formatStories(stories) });

    res.writeHead(200, { "content-type": "text/html" });
    res.end(html);
  });
};

export const start = (stories, port) => {
  const server = createServer(stories);
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  open(`http://localhost:${port}`);
};
