const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "KLMATM DIGITAL",
  url: "https://klmatmdigital.com",
  description:
    "KLMATM DIGITAL is a digital utility and mobile software studio designing and deploying high-utility mobile applications and targeted digital marketplaces that simplify complex workflows.",
  logo: "https://klmatmdigital.com/images/kd_logo.png",
  email: "contact@klmatmdigital.com",
};

export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
