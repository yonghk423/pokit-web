type Props = {
  children: React.ReactNode;
};

/** Route group for non-home pages. Footer is owned by the parent site layout. */
export default function SitePagesLayout({ children }: Props) {
  return children;
}
