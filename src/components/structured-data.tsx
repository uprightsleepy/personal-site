// Prints one or more schema.org objects as JSON-LD, for search engines and
// other crawlers. The objects themselves are built in src/lib/schema.ts.
export default function StructuredData({ data }: { data: object | object[] }) {
  return (
    <>
      {(Array.isArray(data) ? data : [data]).map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // "<" is escaped so nothing in the data can close the script element.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
