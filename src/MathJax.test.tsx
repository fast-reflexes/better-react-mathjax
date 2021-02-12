// @ts-ignore
import React from 'react'
import {render} from "@testing-library/react";

beforeAll(() => {})

it("test", async () => {
    const { queryByText, unmount } = render(
        <div />
    )
    expect(queryByText("null")).toBeNull()
    unmount()
}, 15000);