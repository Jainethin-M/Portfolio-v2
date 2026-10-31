import type { Certificate } from "@/types/portfolio";

/**
 * CERTIFICATES — SAMPLE CONTENT (fictional)
 * PDFs and preview images live in public/certificates/.
 *   pdf: "/certificates/my-cert.pdf"   previewImage: "/certificates/my-cert.webp"
 * Missing files fall back to a generated preview card and hide the PDF link.
 */
export const certificates: Certificate[] = [
  {
    id: "cert-cloud",
    title: "Sample Cloud Practitioner",
    issuer: "Example Cloud Academy",
    issueDate: "2023-05",
    expirationDate: "2026-05",
    credentialId: "SAMPLE-0001",
    verificationUrl: "https://example.com/verify/sample-0001",
    pdf: "/certificates/sample-cloud.pdf",
    previewImage: "/certificates/sample-cloud.webp",
  },
  {
    id: "cert-webgl",
    title: "Sample Advanced WebGL Programming",
    issuer: "Placeholder Learning",
    issueDate: "2022-11",
    credentialId: "SAMPLE-0002",
    verificationUrl: "https://example.com/verify/sample-0002",
    pdf: "/certificates/sample-webgl.pdf",
    previewImage: "/certificates/sample-webgl.webp",
  },
  {
    id: "cert-a11y",
    title: "Sample Web Accessibility Specialist",
    issuer: "Example Accessibility Institute",
    issueDate: "2024-02",
    credentialId: "SAMPLE-0003",
    verificationUrl: "https://example.com/verify/sample-0003",
  },
  {
    id: "cert-devops",
    title: "Sample DevOps Foundations",
    issuer: "Placeholder Learning",
    issueDate: "2021-08",
    expirationDate: "2024-08",
    credentialId: "SAMPLE-0004",
  },
  {
    id: "cert-agile",
    title: "Sample Agile Delivery",
    issuer: "Example Professional Body",
    issueDate: "2020-03",
  },
];
