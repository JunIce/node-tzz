import Photo from '../models/photo';
import Tags from '../models/tags';

let p = new Photo;
let t = new Tags;

let SiteController = {
    index: async (ctx, nxt) =>  {
        // 获取首页推荐列表        
        let photos = await p.getList();
        // 获取首页标签
        let tags =await t.getRecommendTags();
        return await ctx.render('index', {
            title: 'hello world',
            keywords: '兔找找,图片,优美图片,美图',
            description: '兔找找是一个精选优美图片素材聚集地，分享你喜欢的美图，晒晒属于你的美好。',
            photos: photos,
            tags: tags 
        });
    },
    tagList: async (ctx, next) => {
        let {tagid} = ctx.params
        // 标签详细信息
        let tagInfo = await t.getTagDetail(tagid);
        // 获取首页标签
        let tags =await t.getRecommendTags();
        // 标签下的信息id
        let ids = await t.tagsList(tagid);
        let id_array = [];
        for(let info of ids) {
            id_array.push(info.id)
        }
        let res = await p.getListByIdString(id_array.join(','));

        return await ctx.render('tag', {
            title: `${tagInfo[0].tagname} - 图片 - 兔找找`,
            keywords: `${tagInfo[0].tagname}`,
            description: null,
            tags: tags,
            photos: res
        });
    },
    infoDetail: async (ctx, nxt) => {
        let {photo_id} = ctx.params

        let info = await p.getInfoDetail(photo_id);
        console.log(info)
        return await ctx.render('photo', {
            title: `${info.info.title} - 图片 - 兔找找`,
            keywords: `${info.info.title}`,
            description: `${info.info.title}`
        });
    }
}

export default SiteController