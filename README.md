# はじめに

まずは、こちらのYoutubeをご覧ください。

[https://www.youtube.com/watch?v=C3cckUkZVhg](https://www.youtube.com/watch?v=C3cckUkZVhg)

これは、 Rolling ball clock と呼ばれる時計です。

私は、博物館で Rolling ball clock の実物を見ました。 物理現象（重力）を使った仕組みに大変感動しました。

同様の時計を 自作出来ないかと考えました。 例えば、Raspberry Pi で ステッピングモーター を制御するなどです。

ただ、物的な部品を集める ことが面倒です。 そこで、ソフトウェアで似たような時計が作れないかと考えました。

# 出来上がるモノ
![https://github.com/crayoncrayon2003/cat-clock/cat-clock-image.gif](https://github.com/crayoncrayon2003/cat-clock/cat-clock-image.gif)

# アイデア
Rolling ball clock は、物理現象を扱っている以外に、次の特徴があると考えました。

* 不可逆性：転がったボールが時間の進む過程を表現している
* 積み重ね：時間経過に伴う Minutes（ボール）の積み重ねが、Hours（ボール）を表現している。
* など

Windows11 の ウィジェットを使って、これらの特徴を持った時計を作ってみることにしました。

* sample1は、Lively Wallpaper を使った動作確認用サンプルです。
* sample2は、Lively Wallpaper を使ったcat-clockです。
* sample3は、electron を使ったcat-clockです。

