import collections
from sys import argv
from base64 import b64decode


def mining_tunnels(data: str) -> int:
    # Extract spaces and elevator 3D coordinates.
    spaces, elevators = (
        {
            (x, y, level)
            for level, floormap in enumerate(data.split("\n\n"))
            for y, line in enumerate(floormap.splitlines())
            for x, char in enumerate(line)
            if char in chars
        }
        for chars in (".$", "$")
    )

    assert all((x, y, 1 - level) in elevators for x, y, level in elevators)

    # Find the left-most and right-most spaces, i.e. the entrance and exist.
    start, end = (f(spaces, key=lambda x: x[0]) for f in (min, max))
    offsets = [(0, -1), (0, +1), (-1, 0), (+1, 0)]

    # Deptch first search.
    dq = collections.deque([(0, *start)])
    seen = set()

    while dq:
        step, x, y, level = dq.popleft()

        if (x, y, level) == end:
            return step

        # Consider left, right, up, down. And maybe elevators.
        options = [(x + dx, y + dy, level) for dx, dy in offsets]

        if (x, y, level) in elevators:
            options.append((x, y, 1 - level))

        for pos in options:
            if pos in spaces and pos not in seen:
                seen.add(pos)

                # Add one when not riding the elevator.
                next_step = step + (level == pos[2])
                dq.append((next_step, *pos))


def main() -> None:
    solution = mining_tunnels(b64decode(argv[1]).decode("utf-8"))
    print("Solution:", solution)

    return solution


if __name__ == "__main__":
    main()
