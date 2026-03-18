During implementation of TopBar component and layout changes I learned about margin collapsing.

I don't hate CSS enough, what a stupid rule.

If there is block element has no barrier between itself and its first child (padding, boarder, formatting context), the child's top margin doesn't push the child down inside the parent. Instead it "escapes" through the parent and acts as if it belongs to the parent itself. The two margins merge into one, and the strongest one wins.

Disgusting interaction.


## Example solutions for future refference:
- Add padding-top: 1px (or any value) to the parent
- Add border-top: 1px solid transparent to the parent
- Add overflow: hidden or overflow: auto to the parent, this creates a Block Formatting Context, which is the technical mechanism that prevents collapse
- display: flex on the parent also stops it

In this case was used: overflow: hidden; inside #root App.css