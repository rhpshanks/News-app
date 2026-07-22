export default function SkeletonCard() {
  return (
    <div className="card card--skeleton" aria-hidden="true">
      <div className="skel skel--title" />
      <div className="skel skel--line" />
      <div className="skel skel--line skel--short" />
      <div className="skel skel--meta" />
      <div className="skel skel--badges">
        <div className="skel skel--badge" />
        <div className="skel skel--badge" />
        <div className="skel skel--badge" />
      </div>
    </div>
  );
}
