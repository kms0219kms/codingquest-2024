import json
import functools

from sys import argv


def connecting_cities(distance: str, options: str) -> int:
    options = json.loads(options)

    @functools.cache
    def solve(target: int) -> int:
        if target == 0:
            return 1
        return sum(solve(target - option) for option in options if option <= target)

    return solve(int(distance))


def main() -> None:
    solution = connecting_cities(argv[1], argv[2])
    print("Solution:", solution)

    return solution


if __name__ == "__main__":
    main()
