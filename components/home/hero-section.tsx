"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

const heroSlides = [
  {
    id: 1,
    title: "عروض الجمعة البيضاء",
    subtitle: "خصومات تصل إلى 70% على جميع المنتجات",
    image: "/black-friday-sale-banner-with-electronics.jpg",
    cta: "تسوق الآن",
    link: "/deals",
  },
  {
    id: 2,
    title: "أحدث الهواتف الذكية",
    subtitle: "اكتشف مجموعة واسعة من الهواتف الذكية بأفضل الأسعار",
    image: "/placeholder-fnk1f.png",
    cta: "اكتشف المزيد",
    link: "/category/smartphones",
  },
  {
    id: 3,
    title: "أزياء العيد",
    subtitle: "تشكيلة رائعة من الملابس والإكسسوارات للعيد",
    image: "/eid-fashion-collection-banner.jpg",
    cta: "تسوق الأزياء",
    link: "/category/fashion",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[400px] md:h-[500px]">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative h-full w-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-8 text-pretty">{slide.subtitle}</p>
                    <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                      <Link href={slide.link}>{slide.cta}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 rtl:space-x-reverse">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
