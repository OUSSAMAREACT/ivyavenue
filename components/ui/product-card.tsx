import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "./button";

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
}

export function ProductCard({ name, slug, price, image }: ProductCardProps) {
    return (
        <div className="group relative">
            <Link href={`/shop/${slug}`} className="block">
                <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                    <Image
                        src={image}
                        alt={name}
                        width={600}
                        height={800}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />

                    {/* Quick Add Button - Prevent Link click propagation if needed, or keep as part of link but separate button action */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
                        {/* We use a span or div here to avoid nesting button inside link warning if using standard HTML, but Next Link accepts it. 
                            However, better to keep "Quick Add" separate if it opens a modal. 
                            If Quick Add navigates, it's fine. If it adds to cart, we need e.preventDefault(). 
                        */}
                        <Button className="w-full bg-white text-black hover:bg-black hover:text-white shadow-lg border border-transparent hover:border-black font-medium tracking-wide">
                            Quick Add
                        </Button>
                    </div>
                </div>
            </Link>

            <div className="mt-4 text-center space-y-2">
                <Link href={`/shop/${slug}`} className="block">
                    <h3 className="font-serif text-lg md:text-xl group-hover:text-gray-600 transition-colors">{name}</h3>
                </Link>
                <p className="text-gray-500 font-light">${price.toFixed(2)}</p>

                {/* Star Rating (Static Mock) */}
                <div className="flex justify-center items-center gap-0.5 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 text-black fill-black" />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">(12)</span>
                </div>
            </div>
        </div>
    );
}
