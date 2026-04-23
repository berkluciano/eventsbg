import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  id: string;
  name: string;
  slug: string;
  city: string;
  venue: string;
  startsAt: Date;
  squareImage: string | null;
  minPriceCents?: number;
}

export function EventCard({
  name,
  slug,
  city,
  venue,
  startsAt,
  squareImage,
  minPriceCents,
}: EventCardProps) {
  return (
    <Link href={`/events/${slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-brand/20 transition-all duration-200">
        <div className="relative aspect-square bg-gray-100">
          {squareImage ? (
            <Image
              src={squareImage}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/10 to-brand/5">
              <span className="text-4xl">🎫</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-brand transition-colors">
            {name}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDate(startsAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {venue}, {city}
              </span>
            </div>
          </div>
          {minPriceCents !== undefined && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">From </span>
              <span className="text-sm font-semibold text-brand">
                €{(minPriceCents / 100).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
