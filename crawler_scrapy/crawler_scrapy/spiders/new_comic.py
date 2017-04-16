# -*- coding: utf-8 -*-
import scrapy
import json
from scrapy.http.request import Request
from crawler_scrapy.items import ComicItem, ChapterItem


class NewComicSpider(scrapy.Spider):
    name = "new_comic"
    allowed_domains = ["v2.api.dmzj.com"]
    start_urls = ['http://v2.api.dmzj.com/latest/100/%d.json?channel=ios&version=2.1.9' %i for i in range(11)]

    def parse(self, response):
        data = json.loads(response.body.decode('utf-8'))
        for comic in data:
            yield Request('http://v2.api.dmzj.com/comic/%d.json?channel=ios&version=2.1.9' %comic['id'], callback = self.parse_comic)
          
    def parse_comic(self, response):
        data = json.loads(response.body.decode('utf-8'))
        item = ComicItem()
        item['title'] = data['title']
        item['origin_cover'] = data['cover']
        item['description'] = data['description']
        item['update_time'] = data['last_updatetime']
        item['types'] = [tp['tag_name'] for tp in data['types']]
        item['authors'] = [author['tag_name'] for author in data['authors']]
        item['mid'] = data['id']
        item['finished'] = True if data['status'][0]['tag_name'] == '已完结' else False
        for cat in data['chapters']:
            for chapter in cat['data']:
                # yield Request('http://v2.api.dmzj.com/chapter/%d/%d.json?channel=ios&version=2.1.9' % (data['id'], chapter['chapter_id']), callback = self.parse_chapter, meta = { 'cate': cat['title'], 'mid': data['id'], 'comic_name': data['title'] })
                yield Request('http://v2.api.dmzj.com/chapter/%d/%d.json?channel=ios&version=2.1.9' % (data['id'], chapter['chapter_id']), callback = self.parse_chapter, meta = { 'cate': cat['title'], 'mid': data['id'] })
        yield item

    def parse_chapter(self, response):
        data = json.loads(response.body.decode('utf-8'))
        item = ChapterItem()
        item['cate'] = response.meta['cate']
        item['mid'] = response.meta['mid']
        # item['comic_name'] = response.meta['comic_name']
        item['pid'] = data['chapter_id']
        item['title'] = data['title']
        item['order'] = data['chapter_order']
        item['origin_images'] = data['page_url']
        yield item