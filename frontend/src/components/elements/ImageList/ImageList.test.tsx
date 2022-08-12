import React from "react"
import { shallow } from "src/lib/test_util"

import { ImageList as ImageListProto } from "src/autogen/proto"
import { ImageList, ImageListProps } from "./ImageList"

const getProps = (
  elementProps: Partial<ImageListProto> = {}
): ImageListProps => ({
  element: ImageListProto.create({
    imgs: [
      {
        caption: "a",
        url:
          "/media/e275965f8926e17fa8c92c6530be58be11cf5a55474619c16f5442f9.jpeg",
      },
      {
        caption: "b",
        url:
          "/media/e275965f8926e17fa8c92c6530be58be11cf5a55474619c16f5442f9.jpeg",
      },
    ],
    width: -1,
    ...elementProps,
  }),
  width: 0,
  isFullScreen: false,
})

describe("ImageList Element", () => {
  it("renders without crashing", () => {
    const props = getProps()
    const wrapper = shallow(<ImageList {...props} />)

    expect(wrapper.find("StyledImageContainer").length).toBe(2)
  })

  it("should render explicit width for each image", () => {
    const props = getProps({ width: 300 })
    const wrapper = shallow(<ImageList {...props} />)

    expect(wrapper.find("StyledImageContainer").length).toEqual(2)
  })

  it("should have a src", () => {
    const props = getProps()
    const wrapper = shallow(<ImageList {...props} />)

    const { imgs } = props.element
    expect(wrapper.find("StyledImageContainer").length).toEqual(2)
    wrapper
      .find("StyledImageContainer")
      .find("img")
      .forEach((imgWrapper, id) => {
        // @ts-ignore
        expect(imgWrapper.prop("src")).toBe(
          `http://localhost:80${imgs[id].url}`
        )
      })
  })

  it("should have a caption", () => {
    const props = getProps()
    const wrapper = shallow(<ImageList {...props} />)

    const { imgs } = props.element
    expect(wrapper.find("StyledCaption").length).toEqual(2)
    wrapper.find("StyledCaption").forEach((captionWrapper, id) => {
      // @ts-ignore
      expect(captionWrapper.text()).toBe(` ${imgs[id].caption} `)
    })
  })

  it("should render explicit width for each caption", () => {
    const props = getProps({ width: 300 })
    const captionWidth = { width: 300 }
    const wrapper = shallow(<ImageList {...props} />)

    wrapper.find("StyledCaption").forEach(captionWrapper => {
      expect(captionWrapper.prop("style")).toStrictEqual(captionWidth)
    })
  })

  it("should render absolute src", () => {
    const props = getProps({
      imgs: [
        {
          caption: "a",
          url: "https://streamlit.io/path/test.jpg",
        },
      ],
    })
    const wrapper = shallow(<ImageList {...props} />)

    const { imgs } = props.element
    expect(wrapper.find("StyledImageContainer").length).toEqual(1)
    wrapper
      .find("StyledImageContainer")
      .find("img")
      .forEach((imgWrapper, id) => {
        // @ts-ignore
        expect(imgWrapper.prop("src")).toBe(imgs[id].url)
      })
  })

  describe("fullScreen", () => {
    const props = { ...getProps(), isFullScreen: true, height: 100 }
    const wrapper = shallow(<ImageList {...props} />)

    it("should have a caption", () => {
      expect(wrapper.find("StyledCaption").length).toBe(2)
    })

    it("should have the proper style", () => {
      const fullScreenAppearance = { maxHeight: 100, "object-fit": "contain" }

      expect(wrapper.find("StyledImageContainer").length).toEqual(2)
      wrapper
        .find("StyledImageContainer")
        .find("img")
        .forEach(imgWrapper => {
          expect(imgWrapper.prop("style")).toStrictEqual(fullScreenAppearance)
        })
    })
  })
})
