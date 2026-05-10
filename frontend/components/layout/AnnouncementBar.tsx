'use client';

export default function AnnouncementBar() {
  return (
    <div className="bg-primary text-white py-2.5 px-4 text-sm font-medium border-b border-gold/20">
      <div className="container-custom mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden>🚚</span>
          <span className="text-white">توصيل مجاني لجميع المدن المغربية</span>
        </span>
        <span className="hidden sm:inline-block w-px h-4 bg-gold/40" aria-hidden />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-gold font-bold">
          <span aria-hidden>💳</span>
          الدفع عند الاستلام
        </span>
      </div>
    </div>
  );
}
