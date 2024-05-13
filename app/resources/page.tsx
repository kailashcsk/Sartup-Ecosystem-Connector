'use client'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format, set } from 'date-fns'
import { Car, Newspaper, Play, PlayCircle, Rocket } from 'lucide-react'

const page = () => {

  const tutorials = ["x78y1z2", "x8wa7yc", "x5wdp2r", "x8l9ej3", "x8rstix", "x8c32dq"]

  const [news, setNews] = useState([])

  useEffect(() => {
    (async function () {
      const news = await fetch('http://hn.algolia.com/api/v1/search?tags=front_page');
      const { hits } = await news.json();
      setNews(hits);
    })()

  }, [])

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='col-span-2 ml-4'>
        <div className='flex items-center justify-center gap-2 mb-3'>
          <Rocket className='h-5 w-5' />
          <p className='text-lg font-semibold'>
            Trending News
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4'>
          {
            news.map((news, index) => (
              <Card key={index} >
                <CardHeader
                  className='flex flex-row justify-between gap-2 pb-3'
                >
                  <Badge className='text-xs ml-[-5px] '>@{news.author}</Badge>
                  <p className='text-sm text-primary'>{format(new Date(news.created_at), 'MMMM d, yyyy')}</p>
                  <Button
                    className='h-4 underline'
                    variant='link'
                    onClick={() => window.open(news.url, '_blank')}
                  >
                    Read More
                  </Button>
                </CardHeader>
                <CardContent
                  className='text-bold text-lg text-center'

                >
                  {news.title}
                </CardContent>

              </Card>
            ))
          }
        </div>
      </div>


      <Card className='mr-4 h-auto'>
        <CardHeader
          className='flex flex-row items-center justify-start py-3 gap-1'
        >
          <PlayCircle className='h-5 w-5 ' />
          <p className='text-lg font-semibold'
            style={{
              marginTop: '0px',
            }}
          >
            Video Resources
          </p>
        </CardHeader>

        <CardContent>

          {
            tutorials.map((tutorial, index) => (
              <>
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `
                    <iframe
                      style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden"
                      frameborder="0"
                      type="text/html"
                      src="https://www.dailymotion.com/embed/video/${tutorial}"
                      width="100%"
                      height="100%"
                      allowfullscreen
                      title="Dailymotion Video Player"
                    ></iframe>
                  `,
                  }}
                />
                <Separator className='my-4' />
              </>
            ))
          }

        </CardContent>

      </Card>

    </div>
  )
}

export default page

