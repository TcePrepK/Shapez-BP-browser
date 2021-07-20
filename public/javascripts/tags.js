const definedTags = [
    {
        name: 'mixer',
        color: '#f56954'
    },
    {
        name: 'early-game',
        color: '#00a65a'
    }
]

function colorizeTags() {
    const tags = document.getElementsByClassName('tag');
    for(const tag of tags) {
        if(definedTags.find(t => t.name === tag.id)) {
            tag.style.backgroundColor = definedTags.find(t => t.name === tag.id).color;
        } else {
            tag.style.backgroundColor = '#555555';
        }
    }
}