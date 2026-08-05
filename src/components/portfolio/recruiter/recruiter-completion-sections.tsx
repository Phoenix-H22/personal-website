import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";
import styles from "@/styles/portfolio/recruiter-experience.module.scss";

export function RecruiterCompletionSections() {
  return (
    <section className={styles.socialProof} aria-labelledby="social-proof-title">
      <div>
        <p>VERIFIED INDEPENDENT DELIVERY</p>
        <h2 id="social-proof-title">Top Rated. 100% Job Success Score.</h2>
        <p>
          Verified Upwork credential paired with production systems spanning commerce,
          messaging, connected hardware, payments, and founder-built products.
        </p>
        <a href={RECRUITER_PROFILE.upwork} target="_blank" rel="noreferrer">
          View verified Upwork profile
        </a>
      </div>
      <dl>
        <div>
          <dt>EGP 21M+</dt>
          <dd>Verified Warqah Store sales</dd>
        </div>
        <div>
          <dt>100K+</dt>
          <dd>Verified Warqah Store orders</dd>
        </div>
        <div>
          <dt>5,000+</dt>
          <dd>NABD messages processed weekly</dd>
        </div>
      </dl>
    </section>
  );
}
