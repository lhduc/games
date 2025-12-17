import { Scene, GameObjects } from 'phaser';
import Nakama from '../nakama';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    private isAuthed = false;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Auth player first
        Nakama.authenticate().then(() => {
            this.isAuthed = true;
        }).catch((err) => {
            this.isAuthed = false;
            console.log(err);
        })

        this.background = this.add.image(512, 384, 'background');
        const w = this.scale.width;
        const h = this.scale.height;

        // Logo
        this.title = this.add.text(w / 2, h / 2, 'Tic Tac Toe', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const playBtn = this.add
            .rectangle(w / 2, 600, 225, 70, 0xffca27)
            .setInteractive({ useHandCursor: true });

        const playBtnText: GameObjects.Text = this.add
            .text(w / 2, 600, 'Find match', {
                fontFamily: 'Arial',
                fontSize: '36px',
            })
            .setOrigin(0.5);

        playBtn.on('pointerdown', () => {
            Nakama.findMatch().then(() => {
                this.scene.start('Game');
            })
        });
    }
}
