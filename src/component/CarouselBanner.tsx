import React from 'react';
import Autoplay from 'embla-carousel-autoplay'
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel.tsx";

export type Banner ={
    id?: number,
    imageUrl: string,
    targetUrl?: string,
    title?: string,
}

export type CarouselProps = {
    imgSource: Banner[],
}

export const CarouselBanner : React.FC<CarouselProps> = ({imgSource}) => {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full flex-1 "
            // onMouseEnter={plugin.current.stop}
            // onMouseLeave={plugin.current.reset}
        >
            <CarouselContent  >
                {imgSource.map((item, index) => (
                    <CarouselItem key={index} >
                        <div className="w-full ">
                            <Card>
                                <CardContent className="!p-0    items-center justify-center">
                                    <img
                                        className={`h-full w-full object-fill rounded-3xl`}
                                        src={item.imageUrl} alt={item.title}/>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

        </Carousel>
    )
};

export default CarouselBanner;