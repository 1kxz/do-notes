export default function splitText(text: string) {
  let title = '';
  let body = text;
  while (!title.length && body.length) {
    [title] = body.split('\n', 1);
    body = body.slice(title.length + 1);
  }
  return { title, body };
}
