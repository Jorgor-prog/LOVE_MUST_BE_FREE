
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      let i = 0
      function push() {
        if (i>=64) { controller.close(); return }
        const ch = String.fromCharCode(65 + Math.floor(Math.random()*26))
        controller.enqueue(encoder.encode(`data: ${ch}\n\n`))
        i++
        setTimeout(push, 200)
      }
      push()
    }
  })
  return new Response(stream, { headers: { "Content-Type": "text/event-stream" } })
}
