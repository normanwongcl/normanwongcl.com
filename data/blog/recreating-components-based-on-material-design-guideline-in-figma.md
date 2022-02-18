---
title: Recreating components based on Material Design specification in Figma
date: '2022-02-18'
lastmod: '2022-02-18'
tags: ['figma', 'material design', 'web design']
draft: false
summary: Using ruler and rectangle width and height to measure dp unit in Figma
authors: ['default']
---

# Introduction

If you have ever gone through material design guideline before, you might have encountered the "dp" unit whenever you are referencing their documentation.

"dp" or "Density-independent pixels" is a unit measurement for pixel density. Android, IOS and the web all have different calculation for converting "dp" to pixels("px"). More information about "dp" can be found in the [Material Design guidelines](https://material.io/design/layout/pixel-density.html#pixel-density)

In this article, I will only use material design for web design.

"dp" conversion to "px" for the web is very simple: **1 dp = 1 px**.

# Using material design specification

![Card Component Specification](/static/images/card-component-example.png)

[Link to card component specification](https://material.io/components/cards#specs)

For this demo, I will recreate the component from the picture above.

All the numbers specify the width and height of elements in the components using **dp** units. Using a rectangle shape, we can just change the width and height of the rectangle (measured in **px**) to act as a ruler.

![Measuring dp with rectangle shape in Figma](/static/images/using-rectangle-shape-as-a-ruler.png)

Example as illustrasted below:

![Measurement in figma](/static/images/figma-card-measurement-demo.png)

[Link to my Figma file, so you can see the demo](https://www.figma.com/file/e47GapNcM0ilMWIWI0G6XP/Material-design-spec-demo?node-id=0%3A1)
