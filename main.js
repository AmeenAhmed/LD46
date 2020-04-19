document.addEventListener ('DOMContentLoaded', () => {
    window.game = new Game ();
    let audioClick = document.querySelector ('#audio-click');
    
    document.querySelectorAll ('.card-option').forEach ((node) => {
        node.addEventListener ('click', () => {
            let char = node.getAttribute ('x-char');
            game.start (char);
            document.querySelector ('#character-select').classList.add ('hidden');
            document.querySelector ('#board').classList.remove ('hidden');
        });
    })
    // game.start ('wizard');
});