function SectionHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;