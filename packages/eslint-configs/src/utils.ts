interface IDestination {
  other: string;

  [key: string]: string;
}

interface IRule {
  order: number;
  regex: string;
}

class SortRules {
  destination: IDestination = { other: '' };
  deep = 11;

  constructor() {
    const excluded: string[] = [];

    Array.from({ length: this.deep }).forEach((_, index) => {
      const relative = this.relative(index);
      const escaped = this.escape(relative);

      this.destination[index] = this.wrap({ letters: [escaped] });

      excluded.push(escaped);
    });

    this.destination.other = this.wrap({ letters: excluded, positive: false });
  }

  escape(letter: string): string {
    return letter.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
  }

  relative(distance: number): string {
    if (distance < 1) {
      return './';
    }

    return Array.from({ length: distance }).reduce<string>((acc) => {
      return `${acc}../`;
    }, '');
  }

  rules(from: number): IRule[] {
    const result: IRule[] = [{ order: from++, regex: this.destination.other }];

    for (let distance = this.deep - 1; distance >= 0; distance--) {
      const destination = this.destination[distance];

      if (typeof destination === 'string') {
        result.push({ order: from++, regex: destination });
      }
    }

    return result;
  }

  wrap({ letters, positive = true }: { letters: string[]; positive?: boolean }): string {
    const result = letters.join('|');
    const single = letters.length === 1;

    switch (true) {
      case positive && single:
        return `^${result}`;

      case positive && !single:
        return `^(${result})`;

      case !positive && single:
        return `^(?!${result})`;

      default:
        return `^(?!(?:${result}))`;
    }
  }
}

export { SortRules };
