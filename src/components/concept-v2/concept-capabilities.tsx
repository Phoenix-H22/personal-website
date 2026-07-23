const capabilities = [
  {
    title: "Product backends",
    description:
      "Laravel, Node.js, REST APIs, authentication, multi-tenancy, and business-rule systems that stay maintainable under change.",
  },
  {
    title: "Reliability and integrations",
    description:
      "Queues, webhooks, retries, caching, reporting, reconciliation, and third-party platforms that must fail predictably.",
  },
  {
    title: "Delivery across surfaces",
    description:
      "Dashboards, mobile-backed products, IoT controllers, AI pipelines, and deployment details that keep systems operational.",
  },
];

export function ConceptCapabilities() {
  return (
    <section className="c2-section c2-section--dark">
      <div className="c2-shell">
        <div className="c2-section__intro">
          <p>Capabilities</p>
          <h2>Problems I can own end to end.</h2>
          <p className="c2-lead">
            Not a skill cloud — the classes of systems I take responsibility for
            when the complicated part matters.
          </p>
        </div>
        <div className="c2-capabilities">
          {capabilities.map((item) => (
            <article className="c2-capability" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
