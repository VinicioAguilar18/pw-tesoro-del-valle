// Cubre TODO /admin (login + protegidas) con noindex real. Sin esto, el
// login quedaría indexable por buscadores (hallazgo de la auditoría de
// seguridad — el resto de /admin ya estaba protegido por sesión, pero eso
// no evita que Google indexe la URL de login).
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
