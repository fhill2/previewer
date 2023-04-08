import i3ipc
import sys,time

# from f.util import dump

# Connect to the i3 IPC socket
i3 = i3ipc.Connection()

# Get the active workspace of the current monitor
tree = i3.get_tree()

focused_workspace_index = tree.find_focused().workspace().name

previewerList = tree.find_named("PreviewAnything")

if not previewerList:
  print(f"i3wm: previewer not found")
  exit()

previewer = previewerList[0]



def move():
  outputs = i3.get_outputs()
  previewer.command("move to workspace number " + focused_workspace_index)
  time.sleep(0.05)

# delete x_root from outputs
  for output in outputs:
    if output.name == "xroot-0":
      outputs.remove(output)

  sorted_outputs = outputs.sort(key=lambda x: x.rect.x)
# dump(outputs[0].rect)
# dump(outputs[1].rect)

# base_width = the screens to remove to the left of the window with the active monitor on
  base_width = 0
  for output in outputs:
    if previewer.rect.x > (base_width + output.rect.width):
      base_width = base_width + output.rect.width

# move previewer to the top left of its monitor
# print(base_width)
  previewer.command(f"move position {str(base_width + 1)} 145")
# i3.main()

def hide():
  previewer.command("move to scratchpad")


action = sys.argv[1]
if action == "move": move()
if action == "hide": hide()
