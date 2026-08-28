/**
 * Global ambient background: slowly drifting translucent gradient veils
 * plus a fine noise grain, layered to read as depth inside glass.
 */
export function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="veil-a animate-drift-a absolute -top-[30vh] -left-[20vw] h-[90vh] w-[90vw] rounded-full blur-[80px]" />
      <div className="veil-b animate-drift-b absolute top-[20vh] -right-[25vw] h-[80vh] w-[80vw] rounded-full blur-[100px]" />
      <div className="veil-c animate-drift-c absolute bottom-[-25vh] left-[15vw] h-[70vh] w-[70vw] rounded-full blur-[90px]" />
      <div className="grain absolute inset-0 opacity-[0.16]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_35%,#000_95%)]" />
    </div>
  );
}
