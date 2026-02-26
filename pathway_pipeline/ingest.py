import pathway as pw
import json

from pathway_pipeline.soil_twin_state import SoilState

def load_soil_health_card(path: str):
    """
    Reads the CSV as a static table (which acts as the initial state stream).
    """
    # read_csv returns a Table.
    # We want to treat it as a stream of updates (initial snapshot).
    return pw.io.csv.read(
        path,
        schema=SoilState, # Explicit schema required
        mode="streaming" 
    )

def load_simulated_stream(path: str, schema=None):
    """
    Reads a JSON file and simulates a stream by replaying it.
    """
    # In a real deployed pathway app, you might use pw.io.fs.read with mode="streaming"
    # watching a folder. For the demo, input_rate_limit helps simulate "live" feel.
    return pw.io.json.read(
        path,
        schema=schema,
        mode="static" # For now static, but likely we want to iterate?
        # Actually, if we want "Simulated Stream" behavior in Pathway:
        # We can use a script that writes to a port, or just use static data 
        # that mimics a log.
        # For Hackathon demo: The ProjectDiscussion says "Simulated Stream".
        # We can implement a simple generator or just read the json.
        # Let's read it as a table for now, logic will process it.
    )

# Note: For genuine "streaming" feel in the demo, 
# we usually write a separate script that appends line-by-line to a CSV/JSONL file
# that Pathway is watching.
# Or we use Pathway's built-in demo generators.
# For simplicity, we will assume the files exist and Pathway watches them.
