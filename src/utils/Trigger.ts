/**
 * トリガーへ関数の追加・削除のみさせるインターフェース
 * @template Args 登録する関数の引数型
 */
export interface SetOnlyTrigger<Args extends readonly unknown[] = []> {
  add(func: (...args: Args) => void): void;
  addOnce(func: (...args: Args) => void): void;
  delete(func: (...args: Args) => void): void;
}

/**
 * 関数を登録して、呼び出してもらうやつ
 * @template Args 登録する関数の引数型
 */
export interface Trigger<Args extends readonly unknown[] = []> extends SetOnlyTrigger<Args> {
  /**
   * 外部へ公開するためのセット専用トリガー
   */
  asSetOnlyTrigger(): SetOnlyTrigger<Args>;

  /**
   * `fire`されたら実行される関数を追加する
   * @param fn 関数
   */
  add(func: (...args: Args) => void): void;

  /**
   * `fire`されたら１度だけ実行される関数を追加する
   * @param fn 関数
   */
  addOnce(func: (...args: Args) => void): void;

  /**
   * 追加した関数を削除する
   * @param fn 関数
   */
  delete(func: (...args: Args) => void): void;

  /**
   * セットされている関数を全て実行する
   * @param {Args} args 実行する関数の引数
   */
  fire(...args: Args): void;
}

export const Trigger = {
  /**
   *
   * @template Args 登録する関数の引数型
   * @returns
   */
  new<Args extends readonly unknown[] = []>(): Trigger<Args> {
    const funcSet = new Set<(...args: Args) => void>();

    const trigger: Trigger<Args> = {
      asSetOnlyTrigger(): SetOnlyTrigger<Args> {
        return trigger;
      },
      add(func: (...args: Args) => void) {
        funcSet.add(func);
      },
      addOnce(func: (...args: Args) => void) {
        const onceFn = (...args: Args) => {
          func(...args);
          trigger.delete(onceFn);
        };
        trigger.add(onceFn);
      },
      delete(func: (...args: Args) => void) {
        funcSet.delete(func);
      },
      fire(...args: Args) {
        funcSet.forEach(func => func(...args));
      }
    };

    return trigger;
  }
};
